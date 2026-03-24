import { getAllRestaurants, getRestaurantMenu } from '../models/restaurant.model.js';

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await getAllRestaurants();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restaurants', error: error.message });
  }
};

export const getMenuByRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await getRestaurantMenu(id);
    
    if (!menu || menu.length === 0) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu', error: error.message });
  }
};
