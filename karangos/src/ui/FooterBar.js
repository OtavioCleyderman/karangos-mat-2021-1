import { Toolbar, Typography } from "@material-ui/core";

export default function FooterBar()  {
    return (
        <Toolbar>
            <Typography variant='caption' display='block'>
                &copy; 2021 by <a href='mailto:otavio.faria01@fatec.sp.gov.br'>Otávio Cleyderman</a>
            </Typography>
        </Toolbar>
    )
}