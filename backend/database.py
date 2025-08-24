import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional, Any
import os

class DatabaseManager:
    """SQLite 데이터베이스 관리 클래스"""
    
    def __init__(self, db_path: str = "commerce.db"):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        """데이터베이스 연결 반환"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # 딕셔너리 형태로 결과 반환
        return conn
    
    def init_database(self):
        """데이터베이스 초기화"""
        from init_database import init_database
        init_database()
    
    # ===== 사용자 관리 =====
    def create_user(self, user_id: str, email: str) -> bool:
        """사용자 생성"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO users (id, email, updated_at)
                VALUES (?, ?, ?)
            ''', (user_id, email, datetime.now()))
            
            conn.commit()
            return True
        except Exception as e:
            print(f"사용자 생성 오류: {e}")
            return False
        finally:
            conn.close()
    
    def get_user(self, user_id: str) -> Optional[Dict]:
        """사용자 정보 조회"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            user = cursor.fetchone()
            
            return dict(user) if user else None
        except Exception as e:
            print(f"사용자 조회 오류: {e}")
            return None
        finally:
            conn.close()
    
    # ===== 상품 관리 =====
    def create_product(self, user_id: str, product_data: Dict) -> Optional[int]:
        """상품 생성"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO products (
                    user_id, title, price, korean_price, sales_info, 
                    label, category, thumbnail_images, detail_images
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id,
                product_data.get('title', ''),
                product_data.get('price', ''),
                product_data.get('korean_price', ''),
                product_data.get('sales_info', ''),
                product_data.get('label', ''),
                product_data.get('category', ''),
                json.dumps(product_data.get('thumbnail_images', []), ensure_ascii=False),
                json.dumps(product_data.get('detail_images', []), ensure_ascii=False)
            ))
            
            product_id = cursor.lastrowid
            conn.commit()
            return product_id
        except Exception as e:
            print(f"상품 생성 오류: {e}")
            return None
        finally:
            conn.close()
    
    def get_products(self, user_id: str) -> List[Dict]:
        """사용자의 상품 목록 조회"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT * FROM products 
                WHERE user_id = ? 
                ORDER BY created_at DESC
            ''', (user_id,))
            
            products = []
            for row in cursor.fetchall():
                product = dict(row)
                # JSON 문자열을 리스트로 변환
                product['thumbnail_images'] = json.loads(product['thumbnail_images'] or '[]')
                product['detail_images'] = json.loads(product['detail_images'] or '[]')
                products.append(product)
            
            return products
        except Exception as e:
            print(f"상품 목록 조회 오류: {e}")
            return []
        finally:
            conn.close()
    
    def update_product(self, product_id: int, user_id: str, product_data: Dict) -> bool:
        """상품 수정"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE products SET
                    title = ?, price = ?, korean_price = ?, sales_info = ?,
                    label = ?, category = ?, thumbnail_images = ?, detail_images = ?,
                    updated_at = ?
                WHERE id = ? AND user_id = ?
            ''', (
                product_data.get('title', ''),
                product_data.get('price', ''),
                product_data.get('korean_price', ''),
                product_data.get('sales_info', ''),
                product_data.get('label', ''),
                product_data.get('category', ''),
                json.dumps(product_data.get('thumbnail_images', []), ensure_ascii=False),
                json.dumps(product_data.get('detail_images', []), ensure_ascii=False),
                datetime.now(),
                product_id,
                user_id
            ))
            
            conn.commit()
            return cursor.rowcount > 0
        except Exception as e:
            print(f"상품 수정 오류: {e}")
            return False
        finally:
            conn.close()
    
    def delete_product(self, product_id: int, user_id: str) -> bool:
        """상품 삭제"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('DELETE FROM products WHERE id = ? AND user_id = ?', (product_id, user_id))
            
            conn.commit()
            return cursor.rowcount > 0
        except Exception as e:
            print(f"상품 삭제 오류: {e}")
            return False
        finally:
            conn.close()
    
    # ===== 주문 관리 =====
    def create_order(self, user_id: str, order_data: Dict) -> Optional[int]:
        """주문 생성"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO orders (
                    user_id, order_number, customer_name, customer_phone,
                    customer_email, shipping_address, total_amount, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id,
                order_data.get('order_number', ''),
                order_data.get('customer_name', ''),
                order_data.get('customer_phone', ''),
                order_data.get('customer_email', ''),
                order_data.get('shipping_address', ''),
                order_data.get('total_amount', 0),
                order_data.get('status', 'pending')
            ))
            
            order_id = cursor.lastrowid
            
            # 주문 상품들 추가
            for item in order_data.get('items', []):
                cursor.execute('''
                    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                    VALUES (?, ?, ?, ?)
                ''', (order_id, item['product_id'], item['quantity'], item['unit_price']))
            
            conn.commit()
            return order_id
        except Exception as e:
            print(f"주문 생성 오류: {e}")
            return None
        finally:
            conn.close()
    
    def get_orders(self, user_id: str) -> List[Dict]:
        """사용자의 주문 목록 조회"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT o.*, 
                       GROUP_CONCAT(p.title) as product_titles,
                       COUNT(oi.id) as item_count
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE o.user_id = ?
                GROUP BY o.id
                ORDER BY o.created_at DESC
            ''', (user_id,))
            
            orders = []
            for row in cursor.fetchall():
                orders.append(dict(row))
            
            return orders
        except Exception as e:
            print(f"주문 목록 조회 오류: {e}")
            return []
        finally:
            conn.close()
    
    # ===== 설정 관리 =====
    def set_setting(self, user_id: str, key: str, value: str) -> bool:
        """사용자 설정 저장"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO settings (user_id, setting_key, setting_value, updated_at)
                VALUES (?, ?, ?, ?)
            ''', (user_id, key, value, datetime.now()))
            
            conn.commit()
            return True
        except Exception as e:
            print(f"설정 저장 오류: {e}")
            return False
        finally:
            conn.close()
    
    def get_setting(self, user_id: str, key: str) -> Optional[str]:
        """사용자 설정 조회"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute('SELECT setting_value FROM settings WHERE user_id = ? AND setting_key = ?', (user_id, key))
            result = cursor.fetchone()
            
            return result['setting_value'] if result else None
        except Exception as e:
            print(f"설정 조회 오류: {e}")
            return None
        finally:
            conn.close()

# 전역 데이터베이스 매니저 인스턴스
db = DatabaseManager()
