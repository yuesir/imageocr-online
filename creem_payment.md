import express, { Request, Response } from 'express';
import axios from 'axios';
  
const app = express();
const port = 3000;
  
app.get('/checkout', async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
          `https://api.creem.io/v1/checkouts`,
          {
            "product_id": "prod_2kunrEsF4K7qpCbPFmD0np"
          },
          {
            headers: { "x-api-key": `creem_52Qcr5Dgfqm9VhUa3xVeok` },
          }
        );
        
        // Redirect to the checkout URL
        res.redirect(response.data.checkout_url);
    } catch (error) {
        console.error("Error creating checkout:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});