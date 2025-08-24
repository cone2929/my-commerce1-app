import sqlite3
import os
from datetime import datetime

def init_database():
    """SQLite 데이터베이스 초기화 및 테이블 생성"""
    
    # 데이터베이스 파일 경로
    db_path = "commerce.db"
    
    print(f"🗄️ SQLite 데이터베이스 초기화 시작: {db_path}")
    
    # 데이터베이스 연결
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 1. 사용자 테이블 (Supabase 인증과 연동)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        print("✅ 사용자 테이블 생성 완료")
        
        # 2. 상품 테이블
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                price TEXT,
                korean_price TEXT,
                sales_info TEXT,
                label TEXT,
                category TEXT,
                thumbnail_images TEXT, -- JSON 문자열로 저장
                detail_images TEXT,   -- JSON 문자열로 저장
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        print("✅ 상품 테이블 생성 완료")
        
        # 3. 주문 테이블
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                order_number TEXT UNIQUE NOT NULL,
                customer_name TEXT NOT NULL,
                customer_phone TEXT,
                customer_email TEXT,
                shipping_address TEXT,
                total_amount REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        print("✅ 주문 테이블 생성 완료")
        
        # 4. 주문 상품 테이블 (주문과 상품의 다대다 관계)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        ''')
        print("✅ 주문 상품 테이블 생성 완료")
        
        # 5. 설정 테이블
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                setting_key TEXT NOT NULL,
                setting_value TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, setting_key),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        print("✅ 설정 테이블 생성 완료")
        
        # 변경사항 저장
        conn.commit()
        print("✅ 모든 테이블 생성 완료")
        
        # 테이블 목록 확인
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print(f"📋 생성된 테이블 목록: {[table[0] for table in tables]}")
        
    except Exception as e:
        print(f"❌ 데이터베이스 초기화 오류: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()
    
    print(f"🎉 SQLite 데이터베이스 초기화 완료: {db_path}")

if __name__ == "__main__":
    init_database()
