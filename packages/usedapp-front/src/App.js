import { useEthers } from '@usedapp/core';
import './App.css';
import BorrowButton from './components/BorrowButton';
import Connect from './components/Connect';
const { account } = useEthers()

function App() {
  return (
    <div className="App">
			{account && <>{account}</>}
      <Connect/>
      <BorrowButton collectionAddress={"0xbe188D6641E8b680743A4815dFA0f6208038960F"} tokenId={1}/>
    </div>
  );
}

export default App;
