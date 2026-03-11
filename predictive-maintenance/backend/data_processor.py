import numpy as np

def preprocess_sensor_data(data):
    """
    Preprocess incoming sensor data before passing to the model.
    Expects a dictionary with 'temperature', 'vibration', 'pressure'
    Returns a 2D numpy array suitable for sklearn model prediction.
    """
    # Extract features, provide sensible common-case defaults if missing
    temperature = float(data.get('temperature', 70.0))
    vibration = float(data.get('vibration', 5.0))
    pressure = float(data.get('pressure', 100.0))
    
    # In a real-world scenario, you might want to apply StandardScaling
    # or normalization here as used during the model training phase.
    
    # Returning as a 2D array shape: (1, 3)
    return np.array([[temperature, vibration, pressure]])
