pipeline {

    agent any
    
    stages {
        stage("Docker Compose Down") {
            steps {
                sh 'sudo docker compose down'
            }
        }
        stage("Docker Compose Up") {
            steps {
                configFileProvider([configFile(fileId: "fa4175e8-7ba6-470e-8139-7d6a8c020f48", targetLocation: 'config.json')]) {
                    sh 'sudo docker compose up -d --build'
                }
            }
        }
    }
}