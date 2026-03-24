import { 
  getAllRestaurants, 
  getRestaurantById as getRestaurantByIdModel,
  getRestaurantMenu,
  createRestaurant as createRestaurantModel,
  updateRestaurant as updateRestaurantModel,
  deleteRestaurant as deleteRestaurantModel
} from '../models/restaurant.model.js';

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await getAllRestaurants();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Failed to fetch restaurants', error: error.message });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await getRestaurantByIdModel(id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Failed to fetch restaurant', error: error.message });
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
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Failed to fetch menu', error: error.message });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Restaurant name is required' });
    }

    const newRestaurant = await createRestaurantModel({ name, description });

    res.status(201).json({ 
      message: 'Restaurant created successfully',
      restaurant: newRestaurant
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Failed to create restaurant', error: error.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name && !description) {
      return res.status(400).json({ message: 'At least one field is required' });
    }

    const updatedRestaurant = await updateRestaurantModel(id, { name, description });

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ 
      message: 'Restaurant updated successfully',
      restaurant: updatedRestaurant
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ message: 'Failed to update restaurant', error: error.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await deleteRestaurantModel(id);

    if (!success) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ message: 'Failed to delete restaurant', error: error.message });
  }
};
