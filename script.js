const campoCidade = document.getElementById("cidade");

const botaoBuscar = document.getElementById("buscar");

const mensagem = document.getElementById("mensagem");

const nomeCidade = document.getElementById("nomeCidade");

const temperatura = document.getElementById("temperatura");

const condicao = document.getElementById("condicao");

const umidade = document.getElementById("umidade");

const vento = document.getElementById("vento");


botaoBuscar.addEventListener("click", buscarClima);


async function buscarClima() {

    const cidade = campoCidade.value.trim();

    if (!cidade) {
        mensagem.textContent = "Digite uma cidade.";
        return;
    }

    mensagem.textContent = "Buscando informações...";


    const urlGeocodificacao =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;

    const respostaGeo = await fetch(urlGeocodificacao);

    const dadosGeo = await respostaGeo.json();


    if (!dadosGeo.results || dadosGeo.results.length === 0) {
        mensagem.textContent = "Cidade não encontrada.";
        return;
    }


    const local = dadosGeo.results[0];

    const latitude = local.latitude;

    const longitude = local.longitude;


    const urlClima =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

    const respostaClima = await fetch(urlClima);

    const dadosClima = await respostaClima.json();


    const atual = dadosClima.current;


    nomeCidade.textContent = `${local.name}, ${local.country}`;

    temperatura.textContent = `${atual.temperature_2m} °C`;

    umidade.textContent = atual.relative_humidity_2m;

    vento.textContent = atual.wind_speed_10m;

    condicao.textContent = interpretarClima(atual.weather_code);

    mensagem.textContent = "";
}


function interpretarClima(codigo) {

    if (codigo === 0) {
        return "Céu limpo";
    }

    if (codigo === 1 || codigo === 2) {
        return "Parcialmente nublado";
    }

    if (codigo === 3) {
        return "Nublado";
    }

    if (codigo >= 51 && codigo <= 67) {
        return "Chuva";
    }

    if (codigo >= 71 && codigo <= 77) {
        return "Neve";
    }

    if (codigo >= 80 && codigo <= 82) {
        return "Pancadas de chuva";
    }

    if (codigo >= 95) {
        return "Trovoada";
    }

    return "Condição desconhecida";
    
}

