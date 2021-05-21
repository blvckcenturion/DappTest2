
import './App.css'
import {useState} from 'react'
import {ethers} from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const tokenAddres = "0xFCDbd927cA7ca0fB82a167Bce430A710684C7Ff4"  

function App() {
  const [greeting, setGreetingValue] = useState('')

  async function requestAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'});
  }

  async function fetchGreeting() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try{
        const data = await contract.greet()
        console.log('data:', data)
      } catch(err){
        console.log('Error:', err)
      }
    }
  }

  async function setGreeting() {
    if(!greeting) return
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input 
          onChange={e => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
          value={greeting}
        />
      </header>
    </div>
  )
}

export default App
