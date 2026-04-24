require('dotenv').config()
const mongoose = require('mongoose')
const Food = require('./models/food')

// Your admin user ID from MongoDB
const ADMIN_USER_ID = "69e98a14163c404cc51c02a8";

const foods = [
  {
    "name": "Sukto",
    "description": "Traditional Bengali mixed vegetable curry with bitter gourd - A Bestseller",
    "price": 55,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/736x/e2/f8/5d/e2f85d3f8187107d8ec62c045d56e766.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Mochar ghonto",
    "description": "Banana blossom cooked with grated coconut and spices - A Bestseller",
    "price": 50,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/1200x/45/e5/37/45e537ac4a29008e49af71267650f08f.jpg",
    "isAvailable": true,
    "rating": 4.6,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Achari begun",
    "description": "Eggplant cooked with pickling spices",
    "price": 45,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/1200x/f7/6c/45/f76c454417d2f77885c1846973c7ed3d.jpg",
    "isAvailable": true,
    "rating": 4.3,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Piyaj posto",
    "description": "Onions cooked in poppy seed paste - A Bestseller",
    "price": 55,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/736x/b6/b3/95/b6b3957af5434c176deb740ce3fd38ce.jpg",
    "isAvailable": true,
    "rating": 4.7,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Dhokar dalna",
    "description": "Bengali style lentil cakes in gravy - A Bestseller",
    "price": 50,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/736x/e2/31/5a/e2315a230d96155a30cbeccb36245aea.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Thor chehchki",
    "description": "Banana stem stir-fry with coconut",
    "price": 45,
    "category": "Lunch",
    "imageUrl": "",
    "isAvailable": true,
    "rating": 4.2,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Aloo posto",
    "description": "Potatoes cooked in poppy seed paste",
    "price": 55,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/1200x/18/70/13/18701355b2dce27c4cbb200fdf29be2c.jpg",
    "isAvailable": true,
    "rating": 4.4,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Enchor chingri",
    "description": "Raw jackfruit cooked with prawns - Non-veg",
    "price": 55,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/736x/ff/c3/d5/ffc3d5fd7b4ab436f401e76107b55c31.jpg",
    "isAvailable": true,
    "rating": 4.6,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Potol chingri",
    "description": "Parwal (pointed gourd) cooked with prawns - Non-veg",
    "price": 55,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/736x/5e/4b/55/5e4b551a85aa509d6f04004ecd5279cb.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Rui bhapa",
    "description": "Steamed Rohu fish with mustard paste - Non-veg",
    "price": 45,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/1200x/20/43/d7/2043d742281a864ed7896db9fff6f40d.jpg",
    "isAvailable": true,
    "rating": 4.7,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Rui posto",
    "description": "Rohu fish cooked in poppy seed paste - Non-veg",
    "price": 55,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/1200x/dd/5e/a4/dd5ea457200d0475c8dab228cfc9fe32.jpg",
    "isAvailable": true,
    "rating": 4.6,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Katla kalia",
    "description": "Katla fish in rich Bengali gravy - Non-veg",
    "price": 55,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/736x/eb/58/e7/eb58e7a956217dc0a0c22cb71a7aafa3.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Ilish bhapa",
    "description": "Hilsa fish steamed with mustard paste - Non-veg",
    "price": 170,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/236x/85/5e/48/855e4857142180d954e40946813782b0.jpg",
    "isAvailable": true,
    "rating": 4.9,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Sorshe pomfret",
    "description": "Pomfret fish in mustard sauce - Non-veg",
    "price": 170,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/736x/3a/5e/05/3a5e058b6e1c4db9d52e4d48a35e73a5.jpg",
    "isAvailable": true,
    "rating": 4.8,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Sorshe pabda",
    "description": "Pabda fish in mustard gravy - Non-veg",
    "price": 100,
    "category": "Lunch",
    "imageUrl": "https://i.pinimg.com/1200x/3e/4e/54/3e4e543fb2c4a2227364a88fab379cef.jpg",
    "isAvailable": true,
    "rating": 4.7,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Chicken omelette",
    "description": "Omelette with minced chicken filling - Non-veg",
    "price": 30,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/1200x/41/fe/25/41fe259b56bf3cf307c1bd40872318af.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Egg toast",
    "description": "Bread toast with egg topping - Non-veg",
    "price": 16,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/05/b4/40/05b440e0db752c7d6fd1a248f6d05d67.jpg",
    "isAvailable": true,
    "rating": 4.4,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Porota",
    "description": "2 pieces of crispy layered flatbread - Veg",
    "price": 20,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/09/ee/84/09ee84ac672f8b41e10e0613bfa65a92.jpg",
    "isAvailable": true,
    "rating": 4.6,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Ghugni",
    "description": "Per plate - Dried yellow peas curry with spices - Veg",
    "price": 15,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/1200x/74/d0/1c/74d01c59c8392bd8df5b22e322ed5cea.jpg",
    "isAvailable": true,
    "rating": 4.7,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Chicken stew",
    "description": "Per plate - Mild chicken stew with vegetables - Non-veg",
    "price": 35,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/1200x/79/63/b6/7963b6e3c531646214d86f1d25dbfb3a.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Coffee",
    "description": "Per cup - Fresh brewed coffee - Veg",
    "price": 15,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/1200x/26/ab/87/26ab87e0869e7cab25354ceddfb23127.jpg",
    "isAvailable": true,
    "rating": 4.3,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Coffee",
    "description": "Per cup - Fresh brewed coffee - Veg",
    "price": 15,
    "category": "Beverage",
    "imageUrl": "https://i.pinimg.com/1200x/26/ab/87/26ab87e0869e7cab25354ceddfb23127.jpg",
    "isAvailable": true,
    "rating": 4.3,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Fulko ruti",
    "description": "Per piece - Soft fluffy chapati - Veg",
    "price": 4,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/b0/78/7c/b0787c48b1b8f75174f6a56d298a6831.jpg",
    "isAvailable": true,
    "rating": 4.4,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Mutton stew",
    "description": "Per plate - Sunday special mutton stew - Non-veg",
    "price": 65,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/4a/9e/57/4a9e5737afe757a2a67a136c06f0c71f.jpg",
    "isAvailable": true,
    "rating": 4.8,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Toast",
    "description": "2 pieces of butter toast - Veg",
    "price": 10,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/a6/06/4b/a6064be720b78f83e35657231c6f964d.jpg",
    "isAvailable": true,
    "rating": 4.2,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Luchi",
    "description": "2 pieces - Deep fried puffy bread - Veg",
    "price": 20,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/1200x/6d/3a/c1/6d3ac1e22fdcc49f082bee877eea8bf5.jpg",
    "isAvailable": true,
    "rating": 4.6,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Butter toast",
    "description": "Per piece - Crispy toast with butter - Veg",
    "price": 15,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/d0/85/f8/d085f82a65a7bd89f78e3e6e962f7326.jpg",
    "isAvailable": true,
    "rating": 4.3,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Cheese omelette",
    "description": "Omelette with melted cheese - Non-veg",
    "price": 25,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/1200x/bd/7c/af/bd7caf405bfeedb5ef7eb047a6368490.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Cheese chicken omelette",
    "description": "Omelette with cheese and minced chicken - Non-veg",
    "price": 35,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/cb/c9/20/cbc9205a2408017bd7c996861262a91c.jpg",
    "isAvailable": true,
    "rating": 4.7,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Tea",
    "description": "Per cup - Hot masala chai - Veg",
    "price": 10,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/35/8e/6e/358e6e35f65035a7d3f68d923b9626cc.jpg",
    "isAvailable": true,
    "rating": 4.4,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Tea",
    "description": "Per cup - Hot masala chai - Veg",
    "price": 10,
    "category": "Beverage",
    "imageUrl": "https://i.pinimg.com/736x/35/8e/6e/358e6e35f65035a7d3f68d923b9626cc.jpg",
    "isAvailable": true,
    "rating": 4.4,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Green tea",
    "description": "Per cup - Healthy green tea - Veg",
    "price": 15,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/f3/51/4a/f3514ae3469ad66b41a8f9e2cda9be4b.jpg",
    "isAvailable": true,
    "rating": 4.2,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Green tea",
    "description": "Per cup - Healthy green tea - Veg",
    "price": 15,
    "category": "Beverage",
    "imageUrl": "https://i.pinimg.com/736x/f3/51/4a/f3514ae3469ad66b41a8f9e2cda9be4b.jpg",
    "isAvailable": true,
    "rating": 4.2,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Aloo morich",
    "description": "Per plate - Potato and bell pepper stir-fry - Veg",
    "price": 20,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/4d/27/7a/4d277a2d0c0ff65806539b5b0c767165.jpg",
    "isAvailable": true,
    "rating": 4.3,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Aloor dum",
    "description": "Per plate - Spicy potato curry - Veg",
    "price": 15,
    "category": "Breakfast",
    "imageUrl": "https://i.pinimg.com/736x/3d/4f/42/3d4f4217cde1b3342aa77d80af7599b3.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Crispy chicken finger",
    "description": "6 pieces - Crispy fried chicken strips - A Bestseller - Non-veg",
    "price": 90,
    "category": "Evening Snacks",
    "imageUrl": "https://i.pinimg.com/736x/92/21/1f/92211f7e0e23b770353c5e70b412f467.jpg",
    "isAvailable": true,
    "rating": 4.7,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Cheese chicken ball",
    "description": "6 pieces - Cheese stuffed chicken balls - Non-veg",
    "price": 90,
    "category": "Evening Snacks",
    "imageUrl": "https://i.pinimg.com/736x/20/8c/3c/208c3c53629527e541bd3c2f363878d1.jpg",
    "isAvailable": true,
    "rating": 4.6,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Green chicken fry",
    "description": "6 pieces - Herb marinated fried chicken - Non-veg",
    "price": 85,
    "category": "Evening Snacks",
    "imageUrl": "https://i.pinimg.com/736x/31/10/b1/3110b1ba19aad9ad29dbdfe4cf26c9ac.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Chicken kasha",
    "description": "4 pieces - Bengali style spicy chicken curry - Non-veg",
    "price": 100,
    "category": "Dinner",
    "imageUrl": "https://i.pinimg.com/736x/4d/f7/ba/4df7baa25d94a0f4dc2957d312793dbf.jpg",
    "isAvailable": true,
    "rating": 4.7,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Chana masala",
    "description": "Per plate - Chickpeas cooked in onion-tomato gravy - Veg",
    "price": 85,
    "category": "Dinner",
    "imageUrl": "https://i.pinimg.com/1200x/7b/8b/9d/7b8b9d1bfe18c813629c8a6ede18fbc8.jpg",
    "isAvailable": true,
    "rating": 4.4,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Fulko ruti",
    "description": "Per piece - Soft chapati for dinner - Veg",
    "price": 5,
    "category": "Dinner",
    "imageUrl": "https://i.pinimg.com/736x/b0/78/7c/b0787c48b1b8f75174f6a56d298a6831.jpg",
    "isAvailable": true,
    "rating": 4.4,
    "isVeg": true,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Egg tarka",
    "description": "Per plate - Eggs cooked in spicy lentil-based gravy - Non-veg",
    "price": 70,
    "category": "Dinner",
    "imageUrl": "https://i.pinimg.com/1200x/f3/a1/2c/f3a12c6f6762315053082bc099a11cf7.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  },
  {
    "name": "Chili Chicken",
    "description": "Indo-Chinese style spicy chili chicken - Non-veg",
    "price": 100,
    "category": "Dinner",
    "imageUrl": "https://i.pinimg.com/736x/39/c3/04/39c3040e577e670bc46ac67e46825d11.jpg",
    "isAvailable": true,
    "rating": 4.6,
    "isVeg": false,
    "createdBy": "69e98a14163c404cc51c02a8"
  }
]


async function seedFoods() {
    try {
        //connection to database
        await mongoose.connect(process.env.uri);
        console.log('Connected to database');

        //clear existing data
        await Food.deleteMany();
        console.log('Cleared existing foods');

        await Food.insertMany(foods);
        console.log(`Added ${foods.length} food items successfully!`);

        process.exit();
    } catch (error) {
        console.error('Error seeding foods', error);
        process.exit(1);
    }
}

seedFoods();