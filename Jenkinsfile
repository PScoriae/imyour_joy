pipeline {

    agent any
    
    stages {
        
        stage("build") {
            
            steps {
                sh 'sudo docker build --build-arg tz=Asia/Kuala_Lumpur -t imyourjoy .'
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
                sh 'sudo podman run -d --restart --name imyourjoy imyourjoy'
            }
        }

        stage("cleanup") {
            
            steps {
                sh 'sudo docker system prune -f'
            }
        }
    }
}