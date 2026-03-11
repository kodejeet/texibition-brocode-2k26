import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle
import os

def create_synthetic_data():
    """
    Creates a synthetic dataset representing machine sensor readings.
    """
    print("Generating synthetic sensor data...")
    np.random.seed(42)
    n_samples = 2000
    
    # Generate Normal readings
    # Temperature: mean 70C, Vibration: mean 4mm/s, Pressure: mean 100 PSI
    temperature = np.random.normal(70, 8, n_samples)
    vibration = np.random.normal(4, 1.5, n_samples)
    pressure = np.random.normal(100, 10, n_samples)
    
    # Assume 0 = normal operation, 1 = failure
    failure = np.zeros(n_samples)
    
    # Inject logic for 'failures'
    # E.g. High temperature & high vibration usually leads to failure
    failure[(temperature > 85) & (vibration > 7.5)] = 1
    # Very high vibration or extremely weird pressure can also cause failures
    failure[vibration > 9.5] = 1
    failure[(pressure < 60) | (pressure > 140)] = 1
    
    df = pd.DataFrame({
        'temperature': temperature,
        'vibration': vibration,
        'pressure': pressure,
        'failure': failure
    })
    
    # Save the synthetic dataset
    dataset_dir = os.path.join(os.path.dirname(__file__), '../dataset')
    os.makedirs(dataset_dir, exist_ok=True)
    df.to_csv(os.path.join(dataset_dir, 'machine_sensor_data.csv'), index=False)
    print(f"Generated {n_samples} samples. {int(failure.sum())} simulated failures.")
    
    return df

def train_model():
    """
    Trains a predictive model using the generated data.
    """
    df = create_synthetic_data()
    
    # Features & Labels
    X = df[['temperature', 'vibration', 'pressure']]
    y = df['failure']
    
    # Train test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier model...")
    model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    accuracy = model.score(X_test, y_test)
    print(f"Model accuracy on test set: {accuracy * 100:.2f}%")
    
    # Feature Importance
    importances = model.feature_importances_
    features = ['temperature', 'vibration', 'pressure']
    print("Feature Importances:")
    for f, imp in zip(features, importances):
        print(f"  {f}: {imp:.3f}")
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    print(f"Saving trained model to {model_path}...")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print("Done! You can now run the Flask server to serve predictions.")

if __name__ == '__main__':
    train_model()
