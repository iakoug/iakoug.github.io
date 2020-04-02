import Styled from 'styled-components'

export const Wrapper = Styled.div`
    display: block;
    width: 80%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 0 0 0;
    text-align: left;
    font-size: 16px;
    font-family: "Source Sans Pro";
`

export const Blink = Styled.span`
    @keyframes blink {
        0%, 100% {
            opacity: 0
        }

        50% {
            opacity: 1
        }
    }

    margin-left: 4px;
    animation: blink 1s infinite;
`
