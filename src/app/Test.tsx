import   React    from  "react"


export default function TestPrettier ( )    {

    const [ count, setCount] = React.useState(0)
    return (
        <div   style={ { padding : "2rem" } }>
            <h2>Test Prettier</h2>
            <button
                onClick = {()=> setCount( c => c+1 ) }    >
                Clicked { count } times
            </button>
        </div>
    )
}
