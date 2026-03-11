from flask import Flask, request, jsonify
from flask_cors import CORS
import predict
from data_processor import preprocess_sensor_data
import random

app = Flask(__name__)
# Enable CORS for the frontend to communicate easily without proxy configurations
CORS(app) 

# State for our mocked machines to simulate live data
machines_state = [
    {'id': 'M-001', 'name': 'Conveyor Belt A', 'temperature': 72.5, 'vibration': 4.2, 'pressure': 105},
    {'id': 'M-002', 'name': 'Robotic Arm B', 'temperature': 88.1, 'vibration': 9.2, 'pressure': 110},
    {'id': 'M-003', 'name': 'Cooling Pump C', 'temperature': 65.0, 'vibration': 2.1, 'pressure': 65}
]

def update_sensor_data_fluctuations():
    """Simulate real-world minute sensor variations"""
    for m in machines_state:
        # Add a little jitter to readings every time they are fetched
        m['temperature'] += random.uniform(-0.5, 0.5)
        m['vibration'] += random.uniform(-0.2, 0.2)
        m['pressure'] += random.uniform(-1.0, 1.0)
        
        # Clamp values somewhat
        m['temperature'] = round(max(0, m['temperature']), 1)
        m['vibration'] = round(max(0, m['vibration']), 1)
        m['pressure'] = round(max(0, m['pressure']), 1)

@app.route('/api/predict', methods=['POST'])
def run_prediction():
    """Endpoint to run an on-demand prediction for specific sensor data"""
    data = request.json
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
        
    machine_id = data.get('machine_id', 'unknown')
    
    processed_data = preprocess_sensor_data(data)
    failure_prediction = predict.get_prediction(processed_data)
    
    status = 'Needs Maintenance' if failure_prediction == 1 else 'Healthy'
    
    return jsonify({
        'machine_id': machine_id,
        'prediction': failure_prediction,
        'status': status,
        'sensor_data': {
            'temperature': data.get('temperature'),
            'vibration': data.get('vibration'),
            'pressure': data.get('pressure')
        }
    })

@app.route('/api/machines', methods=['GET'])
def get_machines():
    """Endpoint for the dashboard to fetch current status of all machines"""
    # Simulate time passing by mutating the fake readings slightly
    update_sensor_data_fluctuations()
    
    results = []
    # Run predictions for each current state
    for m in machines_state:
        # Process the dict data into numpy array
        processed = preprocess_sensor_data(m)
        # Use our ML model (or fallback) to predict failure
        pred = predict.get_prediction(processed)
        
        # Attach the prediction results directly to the response state
        m['status'] = 'Needs Maintenance' if pred == 1 else 'Healthy'
        m['failure_risk'] = pred 
        results.append(dict(m)) # Append copy to keep state persistent across requests
        
    return jsonify(results)

if __name__ == '__main__':
    print("Starting Predictive Maintenance API Server...")
    app.run(debug=True, port=5000)
