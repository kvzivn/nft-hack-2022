import { useContractFunction, useEthers } from '@usedapp/core'
import { ethers } from "ethers"
import { abi } from "../misc/Poolpi.json";
import * as config from "../misc/config.json"

export default function BorrowButton({collectionAddress, tokenId}){
    const poolpiInterface = new ethers.utils.Interface(abi)
	const poolpiContract = new ethers.Contract(config.poolpiAddress, poolpiInterface)
    const borrow = useContractFunction(poolpiContract, 'borrow')
	const { activateBrowserWallet, account } = useEthers()
	return(
		<div>
			<button onClick={() => borrow(collectionAddress, tokenId)}>Borrow USDC with 1 NFT</button>
		</div>
	)
}