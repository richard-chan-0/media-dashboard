type ExceptionProps = {
    error: string
}

const Exception = ({ error }: ExceptionProps) => {
    if (!error) {
        return <></>
    }

    return (
        <div className="w-full bg-red-300 p-2 text-red-600 text-center opacity-80">
            Exception: {error}
        </div>
    )
}

export default Exception;