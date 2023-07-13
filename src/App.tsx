import { Chart } from './components/Chart';
import { DataViewer } from './components/DataViewer';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Weather report</h1>
      </header>

      <main>
        <Chart />
        <DataViewer />
      </main>
    </div>
  );
}

export default App;
