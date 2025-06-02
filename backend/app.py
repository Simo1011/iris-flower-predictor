from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
logging.basicConfig(level=logging.INFO)

# Load and train the model
iris = load_iris()
X, y = iris.data, iris.target
model = DecisionTreeClassifier()
model.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        app.logger.info(f"Received data: {data}")

        features = [
            float(data['sepal_length']),
            float(data['sepal_width']),
            float(data['petal_length']),
            float(data['petal_width'])
        ]
        prediction = model.predict([features])
        species = iris.target_names[prediction[0]]
        app.logger.info(f"Predicted: {species}")

        return jsonify({'species': species})
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
