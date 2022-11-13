// Copyright 2019-2022 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::Serialize;
use sqlx::{postgres::PgPoolOptions, Column, Pool, Postgres, Row, ValueRef};
use std::{collections::HashMap, sync::Mutex};
use tauri::{command, State};
#[derive(Default)]
struct Connection(Mutex<PgPoolOptions>);

#[derive(Debug)]
pub struct MyState {
    pool: Mutex<Option<Pool<Postgres>>>,
}

#[derive(Debug, Serialize)]
pub struct Response {
    status: i32,
    message: String,
}

#[command]
async fn connect(url: String, state: State<'_, MyState>) -> Result<Response, ()> {
    let pool = PgPoolOptions::new()
        .max_connections(2)
        .connect(url.as_str())
        .await;
    match pool {
        Ok(pool) => {
            let tables = get_tables(&pool).await.unwrap();
            *state.pool.lock().unwrap() = Some(pool);
            Ok(tables)
        }
        Err(err) => Ok(Response {
            status: 500,
            message: err.to_string(),
        }),
    }
}

#[command]
async fn sql(query: String, state: State<'_, MyState>) -> Result<Response, ()> {
    let pool = state.pool.lock().unwrap().clone().unwrap();
    dbg!();
    Ok(execute(query, &pool).await.unwrap())
}

async fn get_tables(pool: &Pool<Postgres>) -> Result<Response, ()> {
    Ok(execute(
        "SELECT tablename FROM pg_catalog.pg_tables where schemaname = 'public' order by tablename"
            .to_string(),
        pool,
    )
    .await
    .unwrap())
}

async fn execute(query: String, pool: &Pool<Postgres>) -> Result<Response, ()> {
    let rows = sqlx::query(&query).fetch_all(pool).await;

    match rows {
        Ok(rows) => {
            let mut result: Vec<HashMap<String, String>> = vec![];
            for row in rows {
                let mut r: HashMap<String, String> = HashMap::new();
                for col in row.columns() {
                    let value = row.try_get_raw(col.ordinal()).unwrap();
                    let value = match value.is_null() {
                        true => "NULL".to_string(),
                        false => {
                            let x = value.as_bytes().unwrap();
                            let y = String::from_utf8_lossy(x).to_string();
                            y
                        }
                    };
                    r.insert(col.name().to_string(), value);
                }
                result.push(r);
            }
            Ok(Response {
                status: 200,
                message: serde_json::json!(result).to_string(),
            })
        }
        Err(err) => Ok(Response {
            status: 500,
            message: err.to_string(),
        }),
    }
}

fn main() {
    tauri::Builder::default()
        .manage(MyState {
            pool: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![connect, sql])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
