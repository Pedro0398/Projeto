
import { stockMenu } from "./UI/StockMenu.js"; 
    
document.getElementById('stockCard').addEventListener('click', async function() {
        await stockMenu();
});




