import { Category } from "../../entities/Category";
import { Question } from "../../entities/Question";

/***
 * Not pleased with the get / set methods here..
 * but unsure how to make these 'act' like a class in the Entity definition(s)
 */
export class OrderDetailUtility {
    // public static setNewOrderDetailValues(order: Question, orderDetail: Category): Category {
    //     orderDetail.orderID = orderDetail.orderID || order.orderID;
    //     orderDetail.totalPrice = orderDetail.totalPrice || 0.00;
    //     orderDetail.orderDatetime = orderDetail.orderDatetime || new Date();
    //
    //     return orderDetail;
    // }
    //
    // public static getOrderDetailTotalPrice(orderDetail: Category): number {
    //     return orderDetail.quantityBought * orderDetail.price;
    // }
}
