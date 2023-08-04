import { ChartViewer } from './components/ChartViewer';
import { DataViewer } from './components/DataViewer';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Weather report</h1>
      </header>

      <main>
        <ChartViewer />
        <DataViewer />
      </main>
    </div>
  );
}

export default App;
