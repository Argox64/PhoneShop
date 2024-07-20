import { Model, Op } from "sequelize";
import { Product } from "../models/Product";

const seed_products = [
    {
        "name": "iPhone 13 Pro",
        "description": "Latest model with A15 Bionic chip and ProMotion display.",
        "price": 999.99,
        "imageUrl": "https://media.ldlc.com/r1600/ld/products/00/05/88/64/LD0005886472_1_0005886523_0005886543_0005886589.jpg"
    },
    {
        "name": "Samsung Galaxy S21",
        "description": "Flagship Samsung phone with Exynos 2100 and AMOLED display.",
        "price": 899.99,
        "imageUrl": "https://m.media-amazon.com/images/I/618nXc9a7gL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        "name": "Google Pixel 6",
        "description": "Google's newest phone with Tensor chip and advanced camera system.",
        "price": 699.99,
        "imageUrl": "https://boulanger.scene7.com/is/image/Boulanger/0810029930833_h_f_l_0?wid=500&hei=500"
    },
    {
        "name": "OnePlus 9 Pro",
        "description": "High-performance phone with Snapdragon 888 and Fluid AMOLED display.",
        "price": 799.99,
        "imageUrl": "https://oasis.opstatics.com/content/dam/oasis/page/2021/9-series/spec-image/9-pro/Morning%20mist-gallery.png"
    },
    {
        "name": "Xiaomi Mi 11",
        "description": "Powerful device with Snapdragon 888 and 108MP camera.",
        "price": 749.99,
        "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZHbIIPD4CeEZaWtx7N4eGqh11cGJ5pKB0Lw&s"
    },
    {
        "name": "Sony Xperia 1 III",
        "description": "Sony's flagship with 4K HDR OLED display and triple camera system.",
        "price": 1199.99,
        "imageUrl": "https://www.sony.fr/image/bec37fd1196426136aae242507e874b0?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF"
    },
    {
        "name": "Oppo Find X3 Pro",
        "description": "Innovative phone with Snapdragon 888 and Billion Color display.",
        "price": 1099.99,
        "imageUrl": "https://m.media-amazon.com/images/I/71LSxjmwC8S.jpg"
    },
    {
        "name": "Huawei P50 Pro",
        "description": "Top-tier phone with Kirin 9000 and advanced Leica camera.",
        "price": 999.99,
        "imageUrl": "https://files.refurbed.com/ii/huawei-p50-pro-1652947812.jpg?t=fitdesign&h=600&w=800"
    },
    {
        "name": "Asus ROG Phone 5",
        "description": "Gaming phone with Snapdragon 888 and 144Hz display.",
        "price": 899.99,
        "imageUrl": "https://cdn.lesnumeriques.com/optim/product/62/62411/41a3ae91-rog-phone-5__450_400.jpeg"
    },
    {
        "name": "Realme GT",
        "description": "Affordable flagship with Snapdragon 888 and 120Hz Super AMOLED display.",
        "price": 599.99,
        "imageUrl": "https://images.frandroid.com/wp-content/uploads/2021/06/realme-gt-frandroid-2021.png"
    }   
];

export const up = async() => {
    let findedProducts = (await Product.findAll({
        attributes: ["name"],
        where: {
            name: {
                [Op.or]: seed_products.map(a => a.name)
            }
        }
    })).map(a => a.name);

    for(let i = 0; i < seed_products.length; i++) {
        if(!findedProducts.includes(seed_products[i].name))
            await Product.create(seed_products[i]);
    }
}

export const down = async() => {
    await Product.destroy({
        where: {
            name: {
                [Op.or]: ["IPhone 12 Pro", "IPhone 12", "Samsung Galaxy"]
            }
        }
    })
}