#include <fstream>
#include <string>

int main() {
    std::ifstream in("raw.txt");
    std::ofstream out("out.txt");

    std::string line;
    getline(in, line);

    char c = line[0];
    
    out << line;

    while (in.good()) {
        getline(in, line);
        if (line[0] == c) out << '\n';
        out << line;
    }

    in.close();
    out.close();

    return 0;
}