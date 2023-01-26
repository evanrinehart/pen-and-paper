function generateId(){
  const alphabet = "abcdeghkmnopqrsuvwxyz";
  const N        = 24;
  const out      = [];
  for(let i = 0; i < N; i++){
    out.push(alphabet[Math.floor(Math.random() * 21)]);
  }
  return out.join('');
}
