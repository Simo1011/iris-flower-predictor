import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const sepal_length = parseFloat((form.elements.namedItem('sepal_length') as HTMLInputElement).value);
    const sepal_width = parseFloat((form.elements.namedItem('sepal_width') as HTMLInputElement).value);
    const petal_length = parseFloat((form.elements.namedItem('petal_length') as HTMLInputElement).value);
    const petal_width = parseFloat((form.elements.namedItem('petal_width') as HTMLInputElement).value);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sepal_length, sepal_width, petal_length, petal_width })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setResult('');
      } else {
        setResult(data.species);
        setError('');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Failed to fetch prediction.');
      setResult('');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">🌸 Iris Flower Predictor</h1>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-2">
          <input className="form-control" name="sepal_length" placeholder="Sepal Length" required />
        </div>
        <div className="mb-2">
          <input className="form-control" name="sepal_width" placeholder="Sepal Width" required />
        </div>
        <div className="mb-2">
          <input className="form-control" name="petal_length" placeholder="Petal Length" required />
        </div>
        <div className="mb-2">
          <input className="form-control" name="petal_width" placeholder="Petal Width" required />
        </div>
        <button className="btn btn-primary" type="submit">Predict</button>
      </form>

      <div>
        {result && <div className="alert alert-success">Predicted Species: {result}</div>}
        {error && <div className="alert alert-danger">Error: {error}</div>}
      </div>
    </div>
  );
}

export default App;
