type ExceptionProps = {
    error: string
}

const Exception = ({ error }: ExceptionProps) => {
    if (!error) {
        return <></>
    }

    return (
        <div className="pt-2 text-red-300">
            Exception: {error}
        </div>
    )
}

export default Exception;