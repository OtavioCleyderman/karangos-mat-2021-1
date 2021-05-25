import {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import {makeStyles} from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import InputMask from 'react-input-mask'


const useStyles = makeStyles (theme => ({
    form: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        maxWidth: '65%',
        margin: '0 auto', 
        '& .MuiFormControl-root' : {
            minWidth: '200px',
            maxWidth: '500px',
            margin: '0 24px 24px 0',
        }
    }
}))

export default function KarangosForm() {

    const classes = useStyles()

    const years = []
    for(let i = (new Date()).getFullYear(); i >= 1900; i--) years.push(i)

    const colors = [
        'Amarelo',
        'Azul',
        'Bege',
        'Branco',
        'Cinza',
        'Dourado',
        'Laranja',
        'Marrom',
        'Prata',
        'Preto',
        'Rosa',
        'Roxo',
        'Verde',
        'Vermelho',
        'Vinho'
    ]

    // Expressão regular definindo a máscara de entrada para a placa
    const placaMask = /[A-Z]{3}-[0-9][0-9A-J][0-9]{2}/

    const [karango, setkarango] = useState({
        id: null,
        marca: '',
        modelo: '',
        cor: '',
        ano_fabricacao: (new Date()).getFullYear(), // Ano corrente
        importado: 0,
        placa: '',
        preco: 0
    })

    const [currentId, setCurrentId] = useState()

    const [importadoChecked, setImportadoChecked] = useState(false)

    function handleInputChange(event, property) {
        setCurrentId(event.target.id)
        if(event.target.id) property = event.target.id

        if(property === 'importado') {
            const newState = ! importadoChecked // Inverte o valor: Se true vira false, se false vira true
            if(newState) setkarango({...karango, importado: '1'})
            else setkarango({...karango, importado: '0'})
            setImportadoChecked(newState) 
        }
        else {
        /* Quando o nome de uma propriedade de objeto aparece entre [], significa
        que o nome da propriedade será determinada pela variável ou expressão
        contida dentro dos colchetes */
        setkarango({...karango, [property]: event.target.value})
        }
    }

    return(
    <>
        <h1>Cadastrar novo karango</h1>
        <form className={classes.form}>
            
            <TextField 
                id="marca" 
                label="Marca" 
                variant="filled" 
                value={karango.marca}
                onChange={handleInputChange}
                placeholder="Informe a marca do veículo"
                required /* not null, precisa ser preenchido */
                fullWidth
            /> 
            <TextField 
                id="modelo" 
                label="Modelo" 
                variant="filled" 
                value={karango.modelo}
                onChange={handleInputChange}
                placeholder="Informe o modelo do veículo"
                required /* not null, precisa ser preenchido */
                fullWidth
            />
            
            <TextField 
                id="cor" 
                label="Cor" 
                variant="filled" 
                value={karango.cor}
                onChange={event => handleInputChange(event, 'cor')}
                placeholder="Informe a cor do veículo"
                required /* not null, precisa ser preenchido */
                select
                fullWidth
            >
                {colors.map(color => <MenuItem value={color}> {color} </MenuItem>)}
            </TextField>

            <TextField 
                id="ano_fabricacao" 
                label="Ano de Fabricação" 
                variant="filled" 
                value={karango.ano_fabricacao}
                onChange={event => handleInputChange(event, 'ano_fabricacao')}
                placeholder="Informe o ano de fabricação do veículo"
                required /* not null, precisa ser preenchido */
                select
                fullWidth
            >
                {years.map(year => <MenuItem value={year}> {year} </MenuItem>)}
            </TextField>

            <FormControl fullWidth>
                <FormControlLabel control={
                    <Checkbox
                        id="importado"
                        checked={importadoChecked}
                        onChange={handleInputChange}
                        color="primary"
                    />
                }
                label="karango importado?"
                />
            </FormControl>

            <InputMask
                id="placa"
                mask={placaMask}
                onChange={handleInputChange}
                value={karango.placa}
            >    
                {() => <TextField 
                    label="Placa" 
                    variant="filled" 
                    placeholder="Informe a placa do veículo"
                    required /* not null, precisa ser preenchido */
                    fullWidth
                /> }
            </InputMask>

            <div>
                <div>{JSON.stringify(karango)}</div>
                <br />
                currentId: {currentId}
            </div>
        </form>
    </>
    )
}