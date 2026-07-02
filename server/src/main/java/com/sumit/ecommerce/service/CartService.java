package com.sumit.ecommerce.service;

import com.sumit.ecommerce.model.CartItem;
import com.sumit.ecommerce.model.Product;
import com.sumit.ecommerce.model.User;
import com.sumit.ecommerce.repository.CartItemRepository;
import com.sumit.ecommerce.repository.ProductRepository;
import com.sumit.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CartItem> getCartByUserId(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        }

        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateQuantity(Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}