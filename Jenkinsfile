pipeline {

    environment {
        imageName = "imyourjoy"
        tz = "Asia/Kuala_Lumpur"
    }

    agent any
    
    stages {
        
        stage("build") {
            
            steps {
                configFileProvider([configFile(fileId: 'fa4175e8-7ba6-470e-8139-7d6a8c020f48', targetLocation: 'config.json')]) {
                    sh 'sudo docker build --build-arg tz=${tz} -t ${imageName} .'
                }
            }
        }

        stage("stop container") {
            
            steps {
                sh 'sudo docker stop ${imageName}'
                sh 'sudo docker rm ${imageName}'
            }
        }

        stage("deploy") {
            
            steps {
                sh 'sudo podman run -d --restart unless-stopped --name ${imageName} ${imageName}'
            }
        }

        stage("cleanup") {
            
            steps {
                sh 'sudo docker system prune -f'
            }
        }
    }
}