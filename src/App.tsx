import { Table } from './components/Table/Table';
import { Chart } from './components/Chart';
import { Controls } from './components/Controls';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Weather report</h1>
        <div className="App__controls">
          <Controls />
        </div>
      </header>

      <main>
        <div className="App__chart">
          <Chart />
        </div>

        <div className="App__table">
          <Table />
        </div>
      </main>
    </div>
  );
}

export default App;
