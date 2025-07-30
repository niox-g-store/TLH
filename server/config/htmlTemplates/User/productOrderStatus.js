exports.productOrderStatus = (order) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            width: 100% !important;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #9172EC;
            padding: 20px;
            text-align: center;
            color: #ffffff;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
        }
        .content p {
            margin-bottom: 15px;
        }
        .order-details {
            background-color: #f9f9f9;
            border-left: 5px solid #9172EC;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .order-details p {
            margin: 5px 0;
        }
        .footer {
            background-color: #eeeeee;
            padding: 20px;
            text-align: center;
            color: #777777;
            font-size: 12px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        .footer p {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Status Update</h1>
        </div>
        <div class="content">
            <p>Hi ${order.customerName},</p>
            <p>We are pleased to provide an update regarding your recent order.</p>

            <div class="order-details">
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Products:</strong> ${order.productNames}</p>
                <p><strong>Current Status:</strong> ${order.status}</p>
            </div>

            <p>
                ${
                    order.status === 'processing'
                        ? 'Your order has been checked out and confirmed, so we\'re working on shipping it.'
                        : order.status === 'shipped'
                        ? 'Your order has been shipped.'
                        : order.status === 'delivered'
                        ? 'Your order has been delivered.'
                        : 'There is an update on your order status.'
                }
            </p>
            <p>We sincerely appreciate your business and thank you for choosing us.</p>
            <p>Should you have any questions or require further assistance, please do not hesitate to contact our customer support team.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} The Link Hangouts. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `
}