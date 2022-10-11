pipeline {
    agent any

    stages{
        stage('Build'){
            steps {
                nodejs('Node Install') {
                    sh 'npm install'
                }
            }
        }
    }
}