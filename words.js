const words = window['list1'].split('\n').map(line => {
    const word = line.split(' - ')[0].trim();
    const definition = line.split(' - ').slice(1).join(' - ').trim().split('Der')[0].trim();
    const regEx = new RegExp(word.split('(')[0].trim(), 'ig');
    return {'word': word, 'definition': definition.replaceAll(regEx, '-----')};
});