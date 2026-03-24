import {
  getMenuItemById as getMenuItemByIdModel,
  getMenuItemsByRestaurant as getMenuItemsByRestaurantModel,
  createMenuItem as createMenuItemModel,
  updateMenuItem as updateMenuItemModel,
  deleteMenuItem as deleteMenuItemModel
} from '../models/menu.model.js';

export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getMenuItemByIdModel(id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ message: 'Failed to fetch menu item', error: error.message });
  }
};

export const getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const items = await getMenuItemsByRestaurantModel(restaurantId);

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No menu items found for this restaurant' });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Failed to fetch menu', error: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, restaurant_id } = req.body;

    // Validation
    if (!name || !price || !restaurant_id) {
      return res.status(400).json({ 
        message: 'Name, price, and restaurant_id are required' 
      });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const newItem = await createMenuItemModel({
      name,
      description,
      price,
      restaurant_id
    });

    res.status(201).json({
      message: 'Menu item created successfully',
      item: newItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Failed to create menu item', error: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!name && !description && price === undefined) {
      return res.status(400).json({ message: 'At least one field is required' });
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const updatedItem = await updateMenuItemModel(id, {
      name,
      description,
      price
    });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({
      message: 'Menu item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Failed to update menu item', error: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await deleteMenuItemModel(id);

    if (!success) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
  }
};
