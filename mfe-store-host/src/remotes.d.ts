declare module "products/ProductsApp" {
  export const ProductsApp: React.ComponentType;
}

declare module "cart/CartApp" {
  export const CartApp: React.ComponentType;
}

declare module "checkout/CheckoutApp" {
  export const CheckoutApp: React.ComponentType;
}

declare module "auth/AuthApp" {
  export const AuthApp: React.ComponentType;
}

declare module "auth/AuthContext" {
  import { ReactNode } from "react";

  export interface User {
    id: string;
    email: string;
    name: string;
  }

  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
  }

  export const AuthProvider: React.ComponentType<{ children: ReactNode }>;
  export const AuthContext: React.Context<AuthContextType | undefined>;
}

declare module "auth/useAuth" {
  import { AuthContextType } from "auth/AuthContext";
  export const useAuth: () => AuthContextType;
}

declare module "auth/ProtectedRoute" {
  import { ReactNode } from "react";
  export const ProtectedRoute: React.ComponentType<{
    children: ReactNode;
    fallback?: ReactNode;
  }>;
}

declare module "search/SearchApp" {
  export const SearchApp: React.ComponentType;
}

declare module "wishlist/WishlistApp" {
  export const WishlistApp: React.ComponentType;
}

declare module "orders/OrdersApp" {
  export const OrdersApp: React.ComponentType;
}

declare module "ui/Button" {
  const Button: React.ComponentType<any>;
  export default Button;
}
