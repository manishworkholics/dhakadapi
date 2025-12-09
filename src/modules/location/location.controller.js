import Location from '../location/location.model.js'

// Add State with Cities (Admin)
export const addLocation = async (req, res) => {
    try {
        const { state, cities } = req.body;

        if (!state || !cities.length) {
            return res.status(400).json({ message: "State and cities are required" });
        }

        const exists = await Location.findOne({ state });
        if (exists) {
            return res.status(400).json({ message: "State already exists" });
        }

        const newLocation = new Location({ state, cities });
        await newLocation.save();

        res.status(201).json({ message: "Location added", data: newLocation });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get all states
export const getStates = async (req, res) => {
    try {
        const states = await Location.find().select("state");
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get cities by state
export const getCitiesByState = async (req, res) => {
    try {
        const { state } = req.params;
        const location = await Location.findOne({ state });

        if (!location) {
            return res.status(404).json({ message: "State not found" });
        }

        res.json({ state, cities: location.cities });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
