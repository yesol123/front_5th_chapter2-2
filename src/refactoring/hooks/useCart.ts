//useCart
import { useState } from "react";

// CartItem: 장바구니 항목, Coupon: 쿠폰 정보, Product: 상품 정보 타입
import { CartItem, Coupon, Product } from "../../types";

// 유틸 함수: 전체 금액 계산, 수량 업데이트 함수 불러오기
import { calculateCartTotal, updateCartItemQuantity } from "../models/cart";

// 장바구니 상태를 관리하는 커스텀 훅 정의
export const useCart = () => {
  // 장바구니 상태 (배열)
  const [cart, setCart] = useState<CartItem[]>([]);

  // 선택된 쿠폰 (기본값은 null)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 상품을 장바구니에 추가
  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);

    // 이미 장바구니에 있는 경우 → 수량 +1
    if (existing) {
      const updatedCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 } // 수량 증가
          : item // 기존 항목 그대로 유지
      );
      setCart(updatedCart);
    } else {
      // 장바구니에 없는 상품이면 새로 추가 (기본 수량 1)
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  // 상품을 장바구니에서 제거
  const removeFromCart = (productId: string) => {
    // 해당 상품 ID가 아닌 항목들만 남기고 제거
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // 상품 수량 업데이트
  const updateQuantity = (productId: string, newQuantity: number) => {
    // 외부 유틸 함수를 사용해 새로운 cart 배열 생성
    const updatedCart = updateCartItemQuantity(cart, productId, newQuantity);
    // 새로운 배열로 상태 업데이트
    setCart(updatedCart);
  };

  //쿠폰 적용
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon); // 선택된 쿠폰 상태에 저장
  };

  // 총합 계산 (할인 전/후, 쿠폰 포함)
  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon); // 유틸 함수 호출
  };

  // 외부에서 사용할 수 있도록 모든 함수와 상태 반환
  return {
    cart,                // 현재 장바구니 배열
    addToCart,           // 상품 추가
    removeFromCart,      // 상품 제거
    updateQuantity,      // 수량 수정
    applyCoupon,         // 쿠폰 선택
    calculateTotal,      // 최종 금액 계산
    selectedCoupon,      // 선택된 쿠폰 상태
  };
};