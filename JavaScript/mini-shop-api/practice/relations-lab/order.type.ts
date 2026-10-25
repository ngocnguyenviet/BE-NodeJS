export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

export type OrderStatusUpdate = {
    orderId: number;
    status: OrderStatus;
};

export type OrderParseResult<T> =
    | {
          ok: true;
          data: T;
      }
    | {
          ok: false;
          error: {
              code: 'INVALID_INPUT' | 'INVALID_ORDER_ID' | 'INVALID_ORDER_STATUS';
              message: string;
          };
      };

export type ParseOrderStatusUpdateResult = OrderParseResult<OrderStatusUpdate>;

export interface UpdatedOrder {
    id: number;
    status: OrderStatus;
}
