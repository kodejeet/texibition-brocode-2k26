import pickle
import os

model = None
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../ml-model/model.pkl')

def load_model():
    """Loads the trained ML model into memory once."""
    global model
    try:
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            print(f"Model loaded successfully from {MODEL_PATH}")
        else:
            print(f"Warning: Model file not found at {MODEL_PATH}.")
            print("Run 'python train_model.py' in the ml-model folder first to generate the model.")
            print("Predictions will use a basic heuristic fallback for now.")
    except Exception as e:
        print(f"Error loading model: {e}")

def get_prediction(processed_data):
    """
    Returns 1 if maintenance is needed (failure predicted), 0 otherwise.
    """
    if model is None:
        # Fallback heuristic if the model hasn't been trained yet
        temp = processed_data[0][0]
        vib = processed_data[0][1]
        
        # Simple heuristic: high temp and high vibration = failure likely
        if temp > 85 and vib > 8:
            return 1
        return 0
    
    # Predict returns an array, we take the primary prediction
    prediction = model.predict(processed_data)
    return int(prediction[0])
    
# Automatically attempt to load the model when the module is imported
load_model()
