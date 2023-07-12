import { Table } from './components/Table/Table';
import { Chart } from './components/Chart';
import { Controls } from './components/Controls';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Weather report</h1>
      </header>

      <main>
        <Controls className="App__controls"/>
        <Chart className="App__chart"/>
        <Table className="App__table" />
      </main>
    </div>
  );
}

export default App;
