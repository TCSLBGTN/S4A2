node{
    
    stage('SCM Checkout'){
        git 'https://github.com/techninjas4/assignment2'
    }
    
    stage('Build Docker Image'){
        sh 'sudo docker build -t techninjas4/assignment2:1.0.0 .'
    }
    
    stage('Push Docker Image'){
        withCredentials([string(credentialsId: 'dockerHubPassword', variable: 'dockerHubPassword')]) {
            sh "sudo docker login -u techninjas4 -p ${dockerHubPassword}"
        }
        sh 'sudo docker push techninjas4/assignment2:1.0.0'
    }
    
    stage('Remove Old Containers'){
        sh 'sudo docker stop $(docker ps -f \"label=assignment2\" -q)'
        sh 'sudo docker rm $(docker ps -a -f \"label=assignment2\" -q)'
    }
    
    stage('Deploy New Containers'){
        sh 'sudo docker run -d -p 5001:3001 --label "assignment2" techninjas4/assignment2:1.0.0'
        sh 'sudo docker run -d -p 5002:3001 --label "assignment2" techninjas4/assignment2:1.0.0'
    }
    
    stage('List of Containers'){
        sh 'sudo docker ps'
    }
}
