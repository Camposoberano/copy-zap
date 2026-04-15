<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$apiKey = "AIzaSyAN8vyXXDhAa2jsF5Jg9PFZ50-dxsEHqGw"; // Sua chave Gemini
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["message" => "Nenhum dado recebido"]);
    exit;
}

// Extrair variáveis
$product = $data['product'] ?? 'Sementes de Mega Sorgo Santa Elisa';
$audience = $data['audience'] ?? 'Pecuarista de Gado de Leite';
$pain = $data['pain'] ?? 'Baixa produção de silagem e custo alto do milho';
$mode = $data['mode'] ?? 'funil';
$subMode = $data['subMode'] ?? '';
$funnelType = $data['funnelType'] ?? 'frio';
$socialNetwork = $data['socialNetwork'] ?? 'Instagram';
$price = $data['price'] ?? '';
$tone = $data['tone'] ?? 'Autoridade Agro';

// MATRIX DE PERSUASÃO (Sales Architecture)
$salesExpertise = "
VOCÊ É O MAIOR ESPECIALISTA EM VENDAS DO AGRO DO BRASIL.
Sua técnica mistura:
1. DALE CARNEGIE (Empatia e Relacionamento): Nunca critique o produtor. Valide o suor dele. Fale do que ele quer (lucro, sossego, família).
2. JORDAN BELFORT (Autoridade e Linha Reta): Use um tom de certeza absoluta. Você é um expert nota 10. Se o produtor tem um problema, você tem a ÚNICA solução lógica.
3. JEFFREY GITOMER (Bíblia das Vendas): Foque no 'Por que' ele compra. Ele não compra semente, ele compra SILAGEM NO COCHO e DINHEIRO NO BOLSO.

DADOS TÉCNICOS DO MEGA SORGO (PARA USAR COMO ARGUMENTO IMBATÍVEL):
- Produtividade: 130 a 140 toneladas/hectare/ano.
- Altura: 5 metros (Gigante).
- Volume: 200% mais volumoso que o milho.
- Resistência: Aguenta seca onde o milho morre.
- Rebrota: Cortou, ele volta com tudo (produção permanente).
- Qualidade: 80% superior ao Capiaçu em termos nutricionais.
";

$systemPrompt = $salesExpertise . "\\nSua missão é gerar conteúdo para vender: '{$product}'.\\n";
$systemPrompt .= "Público-alvo: {$audience}. Dor principal: {$pain}. Preço: {$price}. Tom: {$tone}.\\n";

if ($mode === 'funil') {
    $systemPrompt .= "CRIE UM FUNIL DE WHATSAPP (4 MENSAGENS). \\n";
    $systemPrompt .= "Use a técnica de funil: M1 (Curiosidade/Carnegie), M2 (Agitação da Dor), M3 (Apresentar Solução/Lógica Belfort), M4 (Fechamento Assumido/Gitomer).";
} else if ($mode === 'legenda') {
    $systemPrompt .= "CRIE UMA LEGENDA PARA {$socialNetwork}. Use Gatilhos Mentais de Autoridade e Prova Social.";
} else if ($mode === 'copy') {
    $systemPrompt .= "CRIE UMA COPY PARA {$subMode}. Use Storytelling Agro e Ancoragem de Valor.";
} else if ($mode === 'script') {
    $systemPrompt .= "CRIE UM ROTEIRO PARA {$subMode}. Foco em prender a atenção em 3 segundos.";
}

$systemPrompt .= " \nRESPOSTA OBRIGATÓRIA: Retorne um objeto JSON com o seguinte formato: {\"results\": [{\"title\": \"string\", \"content\": \"string\"}]}. Não adicione texto antes ou depois do JSON.";

$payload = [
    "contents" => [
        ["parts" => [["text" => $systemPrompt]]]
    ],
    "generationConfig" => [
        "temperature" => 0.7,
        "maxOutputTokens" => 1500,
        "responseMimeType" => "application/json"
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(["message" => "Erro na conexão com o servidor da IA: " . curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

$resData = json_decode($response, true);

// Verifica se a API do Google retornou um erro (ex: chave inválida)
if (isset($resData['error'])) {
    http_response_code(500);
    $errMsg = $resData['error']['message'] ?? 'Erro desconhecido na API do Google';
    echo json_encode(["message" => "A IA reportou um erro: " . $errMsg]);
    exit;
}

$textOutput = $resData['candidates'][0]['content']['parts'][0]['text'] ?? '';

if (empty($textOutput)) {
    http_response_code(500);
    echo json_encode(["message" => "A IA retornou uma resposta vazia. Verifique o console do PHP.", "debug" => $response]);
    exit;
}

// Extrai apenas o bloco JSON usando Regex para evitar textos extras da IA
preg_match('/\{[\s\S]*\}/', $textOutput, $matches);
if (isset($matches[0])) {
    echo $matches[0];
} else {
    http_response_code(500);
    echo json_encode(["message" => "A IA não conseguiu gerar o formato de saída correto. Tente novamente.", "debug" => $textOutput]);
}
?>
