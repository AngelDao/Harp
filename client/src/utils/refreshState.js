export const refreshState = (handleContractConnect, handlePricing) => {
    setTimeout(async () => {
        await handleContractConnect()
        await handlePricing()
        console.log("Updated")
    }, 1000 * 10)
}