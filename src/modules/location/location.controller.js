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

// Update State Name (Admin)
export const updateState = async (req, res) => {
    try {
        const { id } = req.params;
        const { state } = req.body;

        const location = await Location.findById(id);

        if (!location) {
            return res.status(404).json({ message: "State not found" });
        }

        location.state = state || location.state;

        await location.save();

        res.json({ message: "State updated successfully", data: location });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Delete State
export const deleteState = async (req, res) => {
    try {
        const { id } = req.params;

        const location = await Location.findByIdAndDelete(id);

        if (!location) {
            return res.status(404).json({ message: "State not found" });
        }

        res.json({ message: "State deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


// Add City to State
export const addCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { city } = req.body;

        const location = await Location.findById(id);

        if (!location) {
            return res.status(404).json({ message: "State not found" });
        }

        if (location.cities.includes(city)) {
            return res.status(400).json({ message: "City already exists" });
        }

        location.cities.push(city);
        await location.save();

        res.json({ message: "City added successfully", data: location });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Update City Name
export const updateCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldCity, newCity } = req.body;

        const location = await Location.findById(id);

        if (!location) {
            return res.status(404).json({ message: "State not found" });
        }

        const cityIndex = location.cities.indexOf(oldCity);

        if (cityIndex === -1) {
            return res.status(404).json({ message: "City not found" });
        }

        location.cities[cityIndex] = newCity;

        await location.save();

        res.json({ message: "City updated successfully", data: location });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Delete City
export const deleteCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { city } = req.body;

        const location = await Location.findById(id);

        if (!location) {
            return res.status(404).json({ message: "State not found" });
        }

        location.cities = location.cities.filter(c => c !== city);

        await location.save();

        res.json({ message: "City deleted successfully", data: location });

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
