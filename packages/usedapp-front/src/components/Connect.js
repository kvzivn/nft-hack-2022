import { useEthers } from '@usedapp/core'

export default function Connect(){
	const { activateBrowserWallet, account } = useEthers()
	return(
		<div>
			<button onClick={() => activateBrowserWallet()}>Connect Wallet</button>
		</div>
	)
}