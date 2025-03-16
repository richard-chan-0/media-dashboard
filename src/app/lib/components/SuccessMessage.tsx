type ExceptionProps = {
    message: string
}

const SuccessMessage = ({ message }: ExceptionProps) => {
    if (!message) {
        return <></>
    }

    return (
        <div className="w-lg pt-2 text-green-300 text-center">
            Success: {message}
        </div>
    )
}

export default SuccessMessage;