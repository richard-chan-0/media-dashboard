type ExceptionProps = {
    message: string
}

const SuccessMessage = ({ message }: ExceptionProps) => {
    if (!message) {
        return <></>
    }

    return (
        <div className="w-full pt-2 text-green-300 text-center text-wrap">
            Success: {message}
        </div>
    )
}

export default SuccessMessage;