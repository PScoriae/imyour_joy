pipeline {

    agent any
    
    stages {
        
        stage("build") {
            
            steps {
                configFileProvider([configFile(fileId: 'fa4175e8-7ba6-470e-8139-7d6a8c020f48', targetLocation: 'config.json')]) {
                    sh 'sudo docker build --build-arg tz=Asia/Kuala_Lumpur -t imyourjoy .'
                }
            }
        }

        stage("stop container") {
            
            steps {
                sh 'sudo docker stop imyourjoy'
                sh 'sudo docker rm imyourjoy'
            }
        }

        stage("deploy") {
            
            steps {
                sh 'sudo podman run -d --restart unless-stopped --name imyourjoy imyourjoy'
            }
        }

        stage("cleanup") {
            
            steps {
                sh 'sudo docker system prune -f'
            }
        }
    }
}