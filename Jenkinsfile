pipeline {

    agent any
    
    stages {
        stage("Docker Compose") {
            steps {
                configFileProvider([configFile(fileId: "fa4175e8-7ba6-470e-8139-7d6a8c020f48", targetLocation: 'config.json')]) {
                    sh 'docker compose up -d --build'
                }
            }
        }
    }
}